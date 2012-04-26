require 'rubygems'
require 'sinatra'
require 'couchrest'
require 'uri'

@couch = CouchRest.new 'http://localhost:5984'
Db = @couch.database! "statserve"
puts Db.inspect

configure do
  set :port, 8888
end

def saveData params
  doc = {}
  params.each do |k,v|
    string = URI.unescape(v)
    next if ["(not set)", "(none)"].include?(string)
    begin
      field = JSON.parse("[#{string}]").first
    rescue
      field = string
    end
    doc[k] = field
  end  
  r = Db.save_doc doc
  r['id']
end

post '/Open-Web-Analytics/log.php' do
  saveData params
end

get '/Open-Web-Analytics/log.php' do
  saveData params
end

get '/Open-Web-Analytics/modules/base/js/owa.tracker-combined-min.js' do
  send_file File.join(settings.public_folder, 'owa.tracker-combined-min.js')
end
