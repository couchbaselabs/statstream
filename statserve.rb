require 'rubygems'
require 'sinatra'
require 'couchbase'
require 'couchrest'
require 'uri'
require 'uuid'

Couch = Couchbase.new("http://localhost:8091/pools/default")

# on startup update the design document
DBURL = 'http://localhost:8092/default'
# puts Db.inspect
design = {
  "_id" => "_design/stats",
  :views => {}
}
views = Dir.glob("design/views/**/*.js")
views.each do |fname|
  parts = fname.split('/');
  vname = parts[-2]
  stage = parts[-1].split('.')[0]
  design[:views][vname] ||= {}
  design[:views][vname][stage] = File.read(fname)
end

ok = CouchRest.put "#{DBURL}/#{design['_id']}", design;

puts "ddoc view #{ok.inspect}"

view = Couch.design_docs#["stats"].daily_traffic



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

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/view/*' do
  puts params.inspect
end

get '/Open-Web-Analytics/modules/base/js/owa.tracker-combined-min.js' do
  send_file File.join(settings.public_folder, 'owa.tracker-combined-min.js')
end
