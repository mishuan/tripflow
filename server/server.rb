require 'sinatra'
require 'json'
require 'httparty'
require 'sinatra/cross_origin'
require 'sinatra/reloader'
require 'byebug'

configure do 
	enable :cross_origin
end

get '/' do
	"hello world"
end

options '*' do
	[200, {"Access-Control-Allow-Origin" => '*', "Access-Control-Allow-Methods" => "GET, POST, PUT", "Access-Control-Allow-Headers" => "access-control-allow-origin, accept"}, {}]
end

get '/search/:dest' do
	response = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{params[:dest]}&key=AIzaSyBiGE9sjCg4FtpySvRyMHSDroAN6Ysh5Do")
	puts response["results"]
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
	url = 
	coordinates.each do |coordinate|

	end
end

get '/route/generate' do

end
