class Author < ActiveRecord::Base
 validates_uniqueness_of :name
 validates_uniqueness_of :email
 has_many :project
end
