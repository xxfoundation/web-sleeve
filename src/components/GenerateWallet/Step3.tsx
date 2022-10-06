import React, { useCallback, useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

import useInput from '../../hooks/useInput';
import type { KeyringPair } from '@polkadot/keyring/types';
import { saveAs } from 'file-saver';
import { Keyring } from '@polkadot/api';

interface Props {
  standardMnemonic: string;
  onFinish: () => void;
}

const genesisHash = '0x50dd5d206917bf10502c68fb4d18a59fc8aa31586f4e8856b493e43544aa82aa';
const getTimestampString = (date: Date) => date.toUTCString().replace(',','').replaceAll(' ', '_').replaceAll(':', '-');

const exportAccount = (keyring: Keyring, keypair: KeyringPair, password: string): void => {
  if (keypair) {
    const exported = keyring.toJson(keypair.address, password)
    const blob = new Blob([JSON.stringify(exported)], { type: 'application/json; charset=utf-8' });
    saveAs(blob, `${keypair.address}_${getTimestampString(new Date())}.json`);
  }
};

function Step3({ onFinish, standardMnemonic }: Props): React.ReactElement {
  const [keypair, setKeypair] = useState<KeyringPair | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useInput('');

  const saveAccount = useCallback((): void => {
    setError(null);
    setLoading(true);
    setTimeout((): void => {
      try {
        // Construct the keying, using ss58 format 55, which is registered for xx network
        const keyring = new Keyring({ type: 'sr25519', ss58Format: 55 });
        const pair = keyring.addFromMnemonic(standardMnemonic, {genesisHash: genesisHash}, 'sr25519');
        setKeypair(pair);
        exportAccount(keyring, pair, password);
        setLoading(false);
      } catch (err) {
        setError('Unable to save your account in an encrypted file.');
        setLoading(false);
      }
    }, 0);
  }, [password, standardMnemonic]);

  return (
    <Stack style={{ margin: '1em' }} spacing={2}>
      <Typography variant='h2'>Finish Wallet Setup</Typography>
      <Typography variant='body3'>Nicely done! You are now ready to use your wallet.</Typography>
      {!keypair && (
        <>
          <Typography variant='body3'>
            Define a password used to save your account on an encrypted file.
          </Typography>
          {error && <Alert severity='error'>{error}</Alert>}
          <Stack direction='row' justifyContent='center' spacing={2}>
            <Box>
              <TextField
                type='password'
                label='Password'
                size='small'
                value={password}
                onChange={setPassword}
              />
            </Box>
            <Button onClick={saveAccount} variant='contained'>
              Save Account and Display Address
            </Button>
          </Stack>
        </>
      )}
      {keypair && keypair.address && (
        <Stack spacing={0}>
          <Typography variant='body3'>
            <b>xx network blockchain address</b>
          </Typography>
          {loading ? 'Saving...' : <Typography variant='body3'>{keypair.address}</Typography>}
        </Stack>
      )}
      <Typography variant='body4' sx={{ marginTop: '2em !important' }}>
        To setup a hardware wallet:{' '}
        <a className='ml-1' href='https://xxnetwork.wiki/Ledger' rel='noreferrer' target='_blank'>
          https://xxnetwork.wiki/Ledger
        </a>
      </Typography>
      <div style={{ textAlign: 'end' }}>
        <Button onClick={onFinish} variant='contained'>
          Done
        </Button>
      </div>
    </Stack>
  );
}

export default Step3;
