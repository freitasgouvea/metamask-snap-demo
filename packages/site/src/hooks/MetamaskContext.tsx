import type { Dispatch, ReactNode, Reducer } from 'react';
import { createContext, useEffect, useReducer } from 'react';

import type { Snap } from '../types';
import {
  detectSnaps,
  getSnap,
  isFlask,
  isLineaNetwork,
  switchToLineaNetwork,
} from '../utils';

export type MetamaskState = {
  snapsDetected: boolean;
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
  success?: string;
};

const initialState: MetamaskState = {
  snapsDetected: false,
  isFlask: false,
};

type MetamaskDispatch = { type: MetamaskActions; payload: any };

export const MetaMaskContext = createContext<
  [MetamaskState, Dispatch<MetamaskDispatch>]
>([
  initialState,
  () => {
    /* no op */
  },
]);

export enum MetamaskActions {
  SetInstalled = 'SetInstalled',
  SetSnapsDetected = 'SetSnapsDetected',
  SetError = 'SetError',
  SetIsFlask = 'SetIsFlask',
  SetSuccess = 'SetSuccess',
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action.payload,
      };

    case MetamaskActions.SetSnapsDetected:
      return {
        ...state,
        snapsDetected: action.payload,
      };
    case MetamaskActions.SetIsFlask:
      return {
        ...state,
        isFlask: action.payload,
      };
    case MetamaskActions.SetError:
      return {
        ...state,
        error: action.payload,
      };
    case MetamaskActions.SetSuccess:
      return {
        ...state,
        success: action.payload,
      };
    default:
      return state;
  }
};

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Find MetaMask Provider and search for Snaps
  // Also checks if MetaMask version is Flask
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setSnapsCompatibility = async () => {
      dispatch({
        type: MetamaskActions.SetSnapsDetected,
        payload: await detectSnaps(),
      });
    };

    setSnapsCompatibility().catch(console.error);
  }, [window.ethereum]);

  // Set installed snaps
  useEffect(() => {
    if (typeof window === 'undefined') return;
    /**
     * Detect if a snap is installed and set it in the state.
     */
    async function detectSnapInstalled() {
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: await getSnap(),
      });
    }

    const checkIfFlask = async () => {
      dispatch({
        type: MetamaskActions.SetIsFlask,
        payload: await isFlask(),
      });
    };

    if (state.snapsDetected) {
      detectSnapInstalled().catch(console.error);
      checkIfFlask().catch(console.error);
    }
  }, [state.snapsDetected]);

  useEffect(() => {
    let errorTimeoutId: number;

    if (typeof window === 'undefined') return;

    if (state.error) {
      errorTimeoutId = window.setTimeout(() => {
        dispatch({
          type: MetamaskActions.SetError,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (errorTimeoutId) {
        window.clearTimeout(errorTimeoutId);
      }
    };
  }, [state.error]);

  useEffect(() => {
    let successTimeoutId: number;

    if (typeof window === 'undefined') return;

    if (state.success) {
      successTimeoutId = window.setTimeout(() => {
        dispatch({
          type: MetamaskActions.SetSuccess,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (successTimeoutId) {
        window.clearTimeout(successTimeoutId);
      }
    };
  }, [state.success]);

  // Switch to Linea network
  useEffect(() => {
    if (typeof window === 'undefined') return;
    /**
     * Check if the current network is Linea and switch to it if it's not.
     */
    const checkAndSwitchToLinea = async () => {
      const isLinea = await isLineaNetwork();
      if (!isLinea) {
        await switchToLineaNetwork();
      }
    };

    checkAndSwitchToLinea().catch(console.error);
  }, []);

  return (
    <MetaMaskContext.Provider value={[state, dispatch]}>
      {children}
    </MetaMaskContext.Provider>
  );
};
