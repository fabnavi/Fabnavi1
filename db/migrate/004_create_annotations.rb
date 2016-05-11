class CreateAnnotations < ActiveRecord::Migration
  def self.up
    create_table :annotations do |t|
      t.string :url
      t.integer :picture_id
      t.timestamps
    end
  end

  def self.down
    drop_table :annotations
  end
end
