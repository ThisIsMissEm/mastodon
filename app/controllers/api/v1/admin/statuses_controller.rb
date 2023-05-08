# frozen_string_literal: true

class Api::V1::Admin::StatusesController < Api::BaseController
  include Authorization

  before_action -> { authorize_if_got_token! :'admin:write', :'admin:write:statuses' }
  before_action :set_status

  after_action :verify_authorized

  def spoiler_text
    authorize [:admin, :status], :index?

    status_batch_action = Admin::StatusBatchAction.new(
      type: 'add_spoiler_text',
      status_ids: [@status.id],
      current_account: current_account,
      report_id: nil,
      send_email_notification: params[:send_email_notification],
      text: params[:text],
      spoiler_text: params[:spoiler_text] || params[:text]
    )

    status_batch_action.save!
  end

  private

  def resource_params
    params.permit(:text, :spoiler_text, :send_email_notification)
  end

  def set_status
    @status = Status.find(params[:id])
  end
end
