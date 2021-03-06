class ApplicationHelper::Toolbar::MiqRequestCenter < ApplicationHelper::Toolbar::Basic
  button_group('miq_request_editing', [
    button(
      :miq_request_copy,
      'fa fa-files-o fa-lg',
      N_('Copy original Request'),
      nil,
      :klass   => ApplicationHelper::Button::MiqRequestCopy,
      :options => {:feature => 'miq_request_copy'}),
    button(
      :miq_request_edit,
      'pficon pficon-edit fa-lg',
      N_('Edit the original Request'),
      nil,
      :klass   => ApplicationHelper::Button::MiqRequestEdit,
      :options => {:feature => 'miq_request_edit'}),
    button(
      :miq_request_delete,
      'pficon pficon-delete fa-lg',
      N_('Delete this Request'),
      nil,
      :url_parms => "&refresh=y",
      :confirm   => N_("Are you sure you want to delete this Request?"),
      :klass     => ApplicationHelper::Button::MiqRequestDelete,
      :options => {:feature => 'miq_request_delete'}),
    button(
      :miq_request_reload,
      'fa fa-refresh fa-lg',
      N_('Refresh this page'),
      N_('Refresh'),
      :url_parms => "&display=miq_provisions",
      :klass   => ApplicationHelper::Button::MiqRequest,
      :options => {:feature => 'miq_request_reload'}),
  ])
  button_group('miq_request_approve', [
    button(
      :miq_request_approve,
      'fa fa-check fa-lg',
      N_('Approve this Request'),
      nil,
      :klass     => ApplicationHelper::Button::MiqRequestApproval,
      :options   => {:feature => 'miq_request_approval'},
      :url       => "/stamp",
      :url_parms => "?typ=a"),
    button(
      :miq_request_deny,
      'fa fa-ban fa-lg',
      N_('Deny this Request'),
      nil,
      :klass     => ApplicationHelper::Button::MiqRequestApproval,
      :options   => {:feature => 'miq_request_approval'},
      :url       => "/stamp",
      :url_parms => "?typ=d"),
  ])
end
