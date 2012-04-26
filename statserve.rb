require 'rubygems'
require 'sinatra'
require 'couchbase'
require 'uri'
require 'uuid'

Couch = Couchbase.new("http://localhost:8091/pools/default")


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
  doc["server_timestamp"] = Time.now.utc
  docid = UUID.generate
  Couch[docid] = doc;
  docid
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
