class Project < ActiveRecord::Base
  validates_uniqueness_of :author, scope: :project_name
  validates :project_name, length:{maximum:30,minimum:4}
  has_many :picture
  belongs_to :author
  
  scope :project_list_default, -> {
    joins(:author).order('updated_at desc').where(Project.arel_table[:status].eq 1)
  }

  scope :authenticated_project_list, ->(authorName) {
    author_id = Author.find_by(:name =>authorName).id
    joins(:author).order('updated_at desc')
    .where(Project.arel_table[:status].eq(1)
           .or(Project.arel_table[:author_id].eq(author_id)))
  }

  scope :find_project, -> (author,project_name){
    joins(:author).find_by(:project_name => project_name,
                         :authors => {:name => author})
  }
end
