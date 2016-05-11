class Annotation < ActiveRecord::Base
  belongs_to :picture
  validates_presence_of :url
end
