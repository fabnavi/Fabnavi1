class CreatePictures < ActiveRecord::Migration
  def self.up
    create_table :pictures do |t|
      t.string :url
      t.string :thumbnail_url
      t.integer :project_id
      t.integer :order_in_project
      t.timestamps
    end
  end

  def self.down
    drop_table :pictures
  end
end
