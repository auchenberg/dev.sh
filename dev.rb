require 'rubygems'
require 'sinatra'
require "sinatra/subdomain"
require 'erb'


set :public, Proc.new { File.join(root, "static") }

configure :development do
	Sinatra::Application.reset!
	use Rack::Reloader
end

get '/' do
  erb :index
end

subdomain :get do
  get '/' do
    "GET FILE"
  end
end

