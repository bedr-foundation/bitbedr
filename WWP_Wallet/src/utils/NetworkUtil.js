import { tronOwnerWeb, TronNetwork } from './TronNetwork';
import bscNetwork from './BSCNetwork';
import ethNetwork from './ETHNetwork';
import polygonNetwork from './POLYGONNetwork';

export const getNetwork = chainId => {
	if (chainId === 'ETH') return ethNetwork;
	else if (chainId === 'POLYGON') return polygonNetwork;
	else if (chainId === 'BSC') return bscNetwork;

	return new TronNetwork();
};
