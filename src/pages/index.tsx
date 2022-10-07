import React, { FC, useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Container } from '@mui/material';

import useStepper from '../hooks/useStepper';
import Step1 from '../components/GenerateWallet/Step1';
import Step2 from '../components/GenerateWallet/Step2';
import Step3 from '../components/GenerateWallet/Step3';
import useNavigatorOnline from '../hooks/useNavOnline';
import { Keyring } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';

const genesisHash = '0x50dd5d206917bf10502c68fb4d18a59fc8aa31586f4e8856b493e43544aa82aa';

const GenerateWallet: FC = () => {
  const { isOnline } = useNavigatorOnline();
  const [step, nextStep, , setStep] = useStepper();
  const { enqueueSnackbar } = useSnackbar();
  const [mnemonics, setMnemonics] = useState<string[]>(['', '']);
  const [keyring, setKeyring] = useState<Keyring | undefined>(undefined);
  const [keypair, setKeypair] = useState<KeyringPair | undefined>(undefined);

  const getAddress = useCallback((): void => {
    setTimeout((): void => {
      try {
        // Construct the keying, using ss58 format 55, which is registered for xx network
        const keyringAux = new Keyring({ type: 'sr25519', ss58Format: 55 });
        const pair = keyringAux.addFromMnemonic(mnemonics[0], {genesisHash: genesisHash}, 'sr25519');
        setKeyring(keyringAux);
        setKeypair(pair);
      } catch (err) {}
    }, 0);
  }, [mnemonics])

  const onMnemonicsFinish = useCallback((): void => {
    getAddress()
    nextStep()
  }, [getAddress, nextStep])

  const onFinish = useCallback(() => {
    setMnemonics(['', '']);
    if (!isOnline) {
      enqueueSnackbar(
        <>Account successfuly generated. You can now turn on internet connectivity</>,
        {
          variant: 'success',
          persist: true
        }
      );
    }
    setTimeout(() => setStep(1), 200);
  }, [enqueueSnackbar, isOnline, setStep]);

  const cancel = useCallback(() => {
    setStep(1);
    setMnemonics(['', '']);
  }, [setStep]);

  

  return (
    <Container maxWidth='md' sx={{ py: 6 }}>
      {step === 1 && <Step1 onFinish={nextStep} setMnemonics={setMnemonics} />}
      {step === 2 && <Step2 mnemonics={mnemonics} cancel={cancel} onFinish={onMnemonicsFinish} />}
      {step === 3 && <Step3 onFinish={onFinish} keypair={keypair} keyring={keyring} />}
    </Container>
  );
};

export default GenerateWallet;
