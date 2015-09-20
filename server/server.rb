require 'sinatra'
require 'json'
require 'httparty'
require 'sinatra/cross_origin'
require 'sinatra/reloader'
require 'byebug'
require 'yelp'

configure do 
	enable :cross_origin
end

options '*' do
	[200, {"Access-Control-Allow-Origin" => '*', "Access-Control-Allow-Methods" => "GET, POST, PUT", "Access-Control-Allow-Headers" => "access-control-allow-origin, accept"}, {}]
end

get '/search/:dest' do
	response = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{params[:dest]}&key=AIzaSyBiGE9sjCg4FtpySvRyMHSDroAN6Ysh5Do")
	destinations = []
	response["results"].each do |result|
		destinations << { :destination => result["formatted_address"],
		:place_id => result["place_id"],
		:lat => result["geometry"]["location"]["lat"],
		:lng => result["geometry"]["location"]["lng"] }
	end
	destinations.to_json
end

get '/route/tsp_optimize/:coordinates' do
	coordinates = params[:coordinates].split("+")
	destinations = []
	pair = coordinates[0].split(",")
	destinations << pair
	url = "https://maps.googleapis.com/maps/api/directions/json?origin=#{pair[0]},#{pair[1]}"
	pair = coordinates[-1].split(",")
	destinations << pair
	url += "&destination=#{pair[0]},#{pair[1]}&waypoints=optimize:true"
	len = coordinates.length - 2
	(1..len).each do |i|
		pair = coordinates[i].split(",")
		url += "|#{pair[0]},#{pair[1]}"
		destinations << pair
	end
	response = HTTParty.get(url)
	route = response["routes"][0];
	totalSteps = []
	route["legs"].each do |leg|
		totalSteps.concat(leg["steps"])
	end 
	puts totalSteps
	totalSteps.to_json
end

get '/yelp/poi/:location/:term' do

	client = Yelp::Client.new({ :consumer_key => "5v4yxqAE93Ggb3r-ti4Ruw",
	                            :consumer_secret => "5SAX-_UHd1lovUoxsxejeztgtsc",
	                            :token => "53dV6Kwg3aXBtaR2JV8xicIs8v4yM3hX",
	                            :token_secret => "pLUl_AGyMpGQQDaD28h8Y64TCPQ"
	                          })
	request = {
		limit: 5,
		term: params[:term]
	}
	response = JSON.parse(client.search(params[:location], request).to_json)
	poi = []
	response["businesses"].each do |r|
		poi << {:rating => r["rating"], :name => r["name"], :image_url => r["image_url"], :coordinates => {:lat => r["location"]["coordinate"]["latitude"], :lng => r["location"]["coordinate"]["longitude"]}}
	end
	poi.to_json
end



