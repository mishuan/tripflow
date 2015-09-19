require 'sinatra'
require 'json'
require 'httparty'

get '/' do
	'Hello world!'
end

get '/search/:dest' do
	response = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{params[:dest]}&key=AIzaSyBiGE9sjCg4FtpySvRyMHSDroAN6Ysh5Do")
	destination = { :formatted_address => response[:address_components][:formatted_address]}
	put destination
	response.to_json
end
