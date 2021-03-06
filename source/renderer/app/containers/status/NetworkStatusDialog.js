// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactModal from 'react-modal';
import os from 'os';
import NetworkStatus from '../../components/status/NetworkStatus';
import styles from './NetworkStatusDialog.scss';
import type { InjectedProps } from '../../types/injectedPropsType';

type Props = InjectedProps;

@inject('stores', 'actions')
@observer
export default class NetworkStatusDialog extends Component<Props> {
  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions, stores } = this.props;
    const { closeNetworkStatusDialog } = actions.app;
    const { restartNode } = actions.networkStatus;
    const { app, networkStatus } = stores;
    const { openExternalLink } = app;
    const {
      // Node state
      cardanoNodeState,
      isNodeResponding,
      isNodeSubscribed,
      isNodeSyncing,
      isNodeInSync,
      isNodeTimeCorrect,
      // Application state
      isConnected,
      isSynced,
      syncPercentage,
      hasBeenConnected,
      localTimeDifference,
      isSystemTimeCorrect,
      forceCheckTimeDifferenceRequest,
      forceCheckLocalTimeDifference,
      getNetworkStatusRequest,
      localBlockHeight,
      networkBlockHeight,
      latestLocalBlockTimestamp,
      latestNetworkBlockTimestamp,
      isSystemTimeIgnored,
      environment,
      diskSpaceAvailable,
      tlsConfig,
      cardanoNodeID,
    } = networkStatus;

    const systemInfo = {
      platform: environment.os,
      platformVersion: os.release(),
      cpu: Array.isArray(environment.cpu) ? environment.cpu[0].model : '',
      ram: this.convertBytesToSize(environment.ram),
      availableDiskSpace: diskSpaceAvailable,
    };

    const coreInfo = {
      daedalusVersion: environment.version,
      daedalusProcessID: environment.rendererProcessID,
      daedalusMainProcessID: environment.mainProcessID,
      isInSafeMode: environment.isInSafeMode,
      cardanoVersion: environment.buildNumber,
      cardanoProcessID: cardanoNodeID,
      cardanoAPIPort: tlsConfig ? tlsConfig.port : 0,
      cardanoNetwork: environment.network,
      daedalusStateDirectory: environment.stateDirectoryPath,
    };

    return (
      <ReactModal
        isOpen
        closeOnOverlayClick
        onRequestClose={closeNetworkStatusDialog.trigger}
        className={styles.dialog}
        overlayClassName={styles.overlay}
        ariaHideApp={false}
      >
        <NetworkStatus
          systemInfo={systemInfo}
          coreInfo={coreInfo}
          cardanoNodeState={cardanoNodeState}
          isDev={environment.isDev}
          isMainnet={environment.isMainnet}
          isStaging={environment.isStaging}
          isTestnet={environment.isTestnet}
          isNodeResponding={isNodeResponding}
          isNodeSubscribed={isNodeSubscribed}
          isNodeSyncing={isNodeSyncing}
          isNodeInSync={isNodeInSync}
          isNodeTimeCorrect={isNodeTimeCorrect}
          isConnected={isConnected}
          isSynced={isSynced}
          syncPercentage={syncPercentage}
          hasBeenConnected={hasBeenConnected}
          localTimeDifference={localTimeDifference}
          isSystemTimeCorrect={isSystemTimeCorrect}
          isForceCheckingNodeTime={forceCheckTimeDifferenceRequest.isExecuting}
          isSystemTimeIgnored={isSystemTimeIgnored}
          latestLocalBlockTimestamp={latestLocalBlockTimestamp}
          latestNetworkBlockTimestamp={latestNetworkBlockTimestamp}
          nodeConnectionError={
            getNetworkStatusRequest.error ||
            forceCheckTimeDifferenceRequest.error
          }
          localBlockHeight={localBlockHeight}
          networkBlockHeight={networkBlockHeight}
          onForceCheckLocalTimeDifference={forceCheckLocalTimeDifference}
          onOpenExternalLink={openExternalLink}
          onRestartNode={restartNode}
          onClose={closeNetworkStatusDialog.trigger}
        />
      </ReactModal>
    );
  }

  convertBytesToSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(
      Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)),
      10
    );
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  };
}
