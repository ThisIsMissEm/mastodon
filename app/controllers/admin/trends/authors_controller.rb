# frozen_string_literal: true

class Admin::Trends::AuthorsController < Admin::BaseController
  def index
    authorize [:admin, :status], :review?

    @authors = []
  end

  def batch
    authorize [:admin, :status], :review?
  rescue ActionController::ParameterMissing
    flash[:alert] = I18n.t('admin.trends.authors.no_author_selected')
  ensure
    redirect_to admin_trends_links_preview_card_providers_path(filter_params)
  end
end
