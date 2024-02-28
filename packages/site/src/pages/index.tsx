import { useContext, useState } from 'react';
import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  // ReconnectButton,
  Card,
  DepositButton,
  WithdrawButton,
  ApproveButton,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext, NFTHandler } from '../hooks';
import {
  approveNFTSnap,
  connectSnap,
  depositNFTSnap,
  getSnap,
  isLocalSnap,
  withdrawNFTSnap,
  // shouldDisplayReconnectButton,
} from '../utils';
import PoolHandler from '../hooks/PoolHandler';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 5rem;
  margin-bottom: 5rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 100rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 90rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const SuccessMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.success?.muted};
  border: 1px solid ${({ theme }) => theme.colors.success?.default};
  color: ${({ theme }) => theme.colors.success?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 90rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const { approve, error: approveError } = NFTHandler();
  const [approveTokenId, setApproveTokenId] = useState<string>('');

  const handleApproveClick = async () => {
    try {
      // Call the Snap function to initiate the approval process
      const snapApprove = await approveNFTSnap('DEMO', approveTokenId);

      if (snapApprove) {
        // If Snap approval is successful, proceed with the transaction
        await handleApproveTransaction();
      } else {
        // If Snap approval fails, dispatch an error message
        dispatch({
          type: MetamaskActions.SetError,
          payload: {
            message: 'User did not confirm the approval action',
          },
        });
      }
    } catch (error) {
      // Handle any errors that occur during the snap process
      dispatch({
        type: MetamaskActions.SetError,
        payload: {
          message: 'Error occurred during approval action',
        },
      });
    }
  };

  const handleApproveTransaction = async () => {
    try {
      // Call the transaction function to send the approval
      const tx = await approve(approveTokenId);

      if (tx.hash) {
        // If transaction is successful, dispatch a success message
        dispatch({
          type: MetamaskActions.SetSuccess,
          payload: '🚀 Approval sent successfully, tx hash: ' + tx.hash,
        });
      }
    } catch (error) {
      // Handle any errors that occur during the transaction
      dispatch({
        type: MetamaskActions.SetError,
        payload: {
          message: approveError ?? 'Error occurred during approve transaction',
        },
      });
    }
  };

  const { deposit, withdraw, error: poolError } = PoolHandler();
  const [depositTokenId, setDepositTokenId] = useState<string>('');
  const [withdrawTokenId, setWithdrawTokenId] = useState<string>('');

  const handleDepositClick = async () => {
    try {
      // Call the Snap function to initiate the deposit process
      const snapDeposit = await depositNFTSnap('DEMO', depositTokenId);

      if (snapDeposit) {
        // If Snap deposit is successful, notify user and proceed with the transaction
        dispatch({
          type: MetamaskActions.SetSuccess,
          payload:
            '✍️ User accepted terms of service. Signature hash: ' +
            String(snapDeposit).substring(0, 48) +
            '...',
        });
        await handleDepositTransaction();
      } else {
        // If Snap deposit fails, dispatch an error message
        dispatch({
          type: MetamaskActions.SetError,
          payload: {
            message: 'User did not confirm the deposit action',
          },
        });
      }
    } catch (error) {
      // Handle any errors that occur during the snap process
      dispatch({
        type: MetamaskActions.SetError,
        payload: {
          message: 'Error occurred during deposit action',
        },
      });
    }
  };

  const handleDepositTransaction = async () => {
    try {
      // Call the transaction function to send the deposit
      const tx = await deposit(depositTokenId);

      if (tx.hash) {
        // If transaction is successful, dispatch a success message
        dispatch({
          type: MetamaskActions.SetSuccess,
          payload: '🚀 Deposit sent with success, tx hash: ' + tx.hash,
        });
      }
    } catch (error) {
      // Handle any errors that occur during the transaction
      dispatch({
        type: MetamaskActions.SetError,
        payload: {
          message: poolError ?? 'Error occurred during deposit transaction',
        },
      });
    }
  };

  const handleWithdrawClick = async () => {
    try {
      // Call the Snap function to initiate the withdraw process
      const snapWithdraw = await withdrawNFTSnap('DEMO', withdrawTokenId);

      if (snapWithdraw) {
        // If Snap withdraw is successful, proceed with the transaction
        await handleWithdrawTransaction();
      } else {
        // If Snap withdraw fails, dispatch an error message
        dispatch({
          type: MetamaskActions.SetError,
          payload: {
            message: 'User did not confirm the withdraw action',
          },
        });
      }
    } catch (error) {
      // Handle any errors that occur during the snap process
      dispatch({
        type: MetamaskActions.SetError,
        payload: {
          message: poolError ?? 'Error occurred during withdraw action',
        },
      });
    }
  };

  const handleWithdrawTransaction = async () => {
    try {
      // Call the transaction function to send the withdraw
      const tx = await withdraw(withdrawTokenId);

      if (tx.hash) {
        // If transaction is successful, dispatch a success message
        dispatch({
          type: MetamaskActions.SetSuccess,
          payload: '🚀 Withdraw sent with success, tx hash: ' + tx.hash,
        });
      }
    } catch (error) {
      // Handle any errors that occur during the transaction
      dispatch({
        type: MetamaskActions.SetError,
        payload: {
          message: poolError ?? 'Error occurred during withdraw transaction',
        },
      });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>NFT Pool</Span>
      </Heading>
      <Subtitle>
        Discover the power of <Span>SNAPS</Span>
      </Subtitle>
      {state.error && (
        <ErrorMessage>
          <b>An error happened:</b> {state.error.message}
        </ErrorMessage>
      )}
      {state.success && <SuccessMessage>{state.success}</SuccessMessage>}
      <CardContainer>
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth={true}
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Connect your Metamask wallet to access the SNAPS and recieve notifications about trending topics and updates from this pool.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
            fullWidth={true}
          />
        )}
        <Card
          content={{
            title: 'Approve NFT',
            description: 'Approve your DEMO NFT to be deposited into the pool.',
            button: (
              <ApproveButton
                onClick={handleApproveClick}
                disabled={!state.installedSnap || approveTokenId === ''}
              />
            ),
            input: 'NFT ID',
          }}
          disabled={!state.installedSnap}
          inputValue={approveTokenId}
          setInputValue={setApproveTokenId}
        />
        <Card
          content={{
            title: 'Deposit NFT',
            description:
              'Deposit your DEMO NFT into the pool to see the snap in action.',
            button: (
              <DepositButton
                onClick={handleDepositClick}
                disabled={!state.installedSnap || depositTokenId === ''}
              />
            ),
            input: 'NFT ID',
          }}
          disabled={!state.installedSnap}
          inputValue={depositTokenId}
          setInputValue={setDepositTokenId}
        />
        <Card
          content={{
            title: 'Withdraw NFT',
            description:
              'Withdraw your DEMO NFT from the pool to see the snap in action.',
            button: (
              <WithdrawButton
                onClick={handleWithdrawClick}
                disabled={!state.installedSnap || withdrawTokenId === ''}
              />
            ),
            input: 'NFT ID',
          }}
          disabled={!state.installedSnap}
          inputValue={withdrawTokenId}
          setInputValue={setWithdrawTokenId}
        />
        {/* {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Subscrible to NFT Pool',
              description:
                'Connect your Metamask wallet to recieve notifications about trending topics and updates from this pool.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
            fullWidth={true}
          />
        )} */}
        <Notice>
          <p>
            This example demonstrates how to use the MetaMask Snaps API to
            connect to and install a snap, and how to use the snap to send a
            message to the MetaMask UI. Request your DEMO NFT using{' '}
            <a
              href="https://goerli.lineascan.build/address/0x56F25c991cCcD6c2171F2c1BE190608ab1f09369#writeContract"
              target="_blank"
              rel="noopener noreferrer"
            >
              request faucet
            </a>{' '}
            and access the{' '}
            <a
              href="https://github.com/freitasgouvea/metamask-snap-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              github repository
            </a>{' '}
            for more information.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
