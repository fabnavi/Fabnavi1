class Picture < ActiveRecord::Base
  has_many :annotation
  belongs_to :project
  validates_presence_of :url,:project
  validates :url, length: {maximum:300}
  validates :thumbnail_url, length: {maximum:300}
#  validates_format_of :url, with: /http\:\/\/.*/
#  validates_format_of :thumbnail_url, with: /http\:\/\/.*/,:allow_blank => true
  scope :pictures_list, ->(id) {
    order("order_in_project asc").where(:project_id => id)  
  }
end
