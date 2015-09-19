require 'sinatra'
require 'json'
require 'httparty'

get '/' do
	'Hello world!'
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

