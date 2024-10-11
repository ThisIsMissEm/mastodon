# frozen_string_literal: true

module Settings
  module Exports
    class AccountNotesController < BaseController
      include Settings::ExportControllerConcern

      def index
        send_export_file
      end

      private

      def export_data
        @export.to_account_notes_csv
      end
    end
  end
end
