class CreateProjects < ActiveRecord::Migration
  def self.up
    create_table :projects do |t|
      t.string :project_name
      t.integer :thumbnail_picture_id
      t.integer :author_id
      t.integer :status
      t.timestamps
    end
  end

  def self.down
    drop_table :projects
  end
end
