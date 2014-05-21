module Fabnavi
  DATADIR = Dir.pwd.to_s + "/public/data/"
  OUTER_DATADIR = "data/"

  def save_pict url, id
    fileName =File.basename(/^http.*.JPG/.match(url)[0])
    filePath = DATADIR+id+"/original/"+ fileName
    puts thumnailPath
    open(filePath, 'wb') do |output|
      open(url) do |data| 
        output.write(data.read)
      end
    end
  end

  def save_config id ,data
    fileName = "fabnavi.play.config"
    dirName = DATADIR + id + "/"
    filePath = dirName + fileName
    open(filePath, 'w') do |output|
      output.write(data)
    end
  end

  def backup_config id
    dirName = DATADIR + id  + "/"
    backup = dirName+Time.now.utc.to_s+".config"
    conf = REXML::Document.new(open(dirName+"fabnavi.play.config"))
    if conf.elements.size > 0 and conf.elements["playsetting/imgurls"].size > 0 then
      FileUtils.copy_file(dirName+"fabnavi.play.config",backup)
    end
  end
end
