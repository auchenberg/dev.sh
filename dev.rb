require 'rubygems'
require 'sinatra'
require "sinatra/subdomain"
require 'erb'

require 'open-uri'


set :public_folder, Proc.new { File.join(root, "static") }

configure :development do
	Sinatra::Application.reset!
	use Rack::Reloader
end

get '/' do

	domain = request.host.split('.')[0]

	if domain == 'get'
		return open('https://raw.github.com/auchenberg/dev/master/install.sh') {|f|
			f.read
		}
	end

  erb :index
end



subdomain do
  get '/' do
    "TEST"
  end
end

