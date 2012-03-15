namespace :tz do

  directory "vendor/tzdata"

  desc <<-END
import a new version of the olsen database.
get the latest version from http://www.iana.org/time-zones.
extract it locally, then call this task.
rake tz:import FROM=path/to/new/tzdata
END
  task :import => "vendor/tzdata" do
    from = ENV["FROM"] && ROOT.join(ENV["FROM"])
    to   = ROOT.join("vendor", "tzdata")
    unless from && File.exists?(from)
      puts "you must include a FROM!\nrake tz:import FROM=path/to/new/tzdata"
      puts "FROM=#{from}"
      exit 1
    end

    Dir.foreach(from) do |file|
      # files we care about have no file extension
      # also skipping . and ..
      next if file.index(".")
      copy_without_comments(from.join(file), to.join(file))
    end
  end

  def copy_without_comments(infile, outfile)
    File.open(infile, "r:utf-8:ascii", :invalid => :replace, :replace => '') do |i|
      puts "opening #{infile}"
      File.open(outfile, "w") do |o|
        done = false
        until done
          begin
            l = i.readline
            if l !~ /^#.*$/ && l != "\n"
              o.write l
            end
          rescue EOFError
            done = true
          end
        end
      end
    end
  end
end
