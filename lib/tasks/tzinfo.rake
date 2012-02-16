require 'tzinfo'
require 'json'
namespace :tz do
  desc "find the current UTC offsets of each time zone"
  task :offsets do
    timezones = JSON.parse(File.read("app/assets/json/timezones.json"))
    offsets = {}
    now = Time.now
    timezones.each do |tz|
      zname = tz['z']
      unless offsets.has_key? zname
        zone = TZInfo::Timezone.get(zname)
        offsets[zname] = zone.period_for_utc(now).utc_total_offset
      end
    end

    File.open("app/assets/json/zone_offsets.json", 'w') do |outfile|
      JSON.dump(offsets, outfile)
    end
  end
end
