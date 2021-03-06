// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import SupportSettings from '../../../components/settings/categories/SupportSettings';
import type { InjectedProps } from '../../../types/injectedPropsType';
import { generateFileNameWithTimestamp } from '../../../../../common/utils/files';
import { getSupportUrl } from '../../../utils/network';

const messages = defineMessages({
  supportRequestLinkUrl: {
    id: 'settings.support.reportProblem.linkUrl',
    defaultMessage: '!!!https://iohk.zendesk.com/hc/en-us/requests/new/',
    description:
      '"submit a support request" link URL in the "Report a problem" section on the support settings page.',
  },
});

type State = {
  disableDownloadLogs: boolean,
};

@inject('stores', 'actions')
@observer
export default class SupportSettingsPage extends Component<
  InjectedProps,
  State
> {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static defaultProps = { actions: null, stores: null };

  constructor(props: InjectedProps) {
    super(props);
    const { profile } = this.props.actions;
    profile.downloadLogsSuccess.listen(() =>
      this.toggleDisableDownloadLogs(false)
    );
  }

  state = {
    disableDownloadLogs: false,
  };

  handleSupportRequestClick = async (
    event: SyntheticEvent<HTMLButtonElement>
  ) => {
    event.persist();
    const { intl } = this.context;
    const supportRequestLinkUrl = intl.formatMessage(
      messages.supportRequestLinkUrl
    );
    const locale = this.props.stores.profile.currentLocale;
    const supportUrl = await getSupportUrl(supportRequestLinkUrl, locale);
    this.props.stores.app.openExternalLink(supportUrl);
  };

  handleDownloadLogs = () => {
    // TODO: refactor this direct access to the dialog api
    const fileName = generateFileNameWithTimestamp();
    const { profile } = this.props.actions;
    const destination = global.dialog.showSaveDialog({
      defaultPath: fileName,
    });
    if (destination) {
      this.toggleDisableDownloadLogs(true);
      profile.downloadLogs.trigger({ fileName, destination, fresh: true });
    }
  };

  toggleDisableDownloadLogs = (disableDownloadLogs: boolean) => {
    this.setState({ disableDownloadLogs });
  };

  render() {
    const { stores } = this.props;

    return (
      <SupportSettings
        onExternalLinkClick={stores.app.openExternalLink}
        onSupportRequestClick={this.handleSupportRequestClick}
        onDownloadLogs={this.handleDownloadLogs}
        disableDownloadLogs={this.state.disableDownloadLogs}
      />
    );
  }
}
