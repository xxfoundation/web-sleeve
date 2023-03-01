import React, { FC, useCallback, useState } from 'react';
import { Container } from '@mui/material';

import useStepper from '../hooks/useStepper';
import Step1 from '../components/GenerateWallet/Step1';
import Step2 from '../components/GenerateWallet/Step2';
import Step3 from '../components/GenerateWallet/Step3';
import { Keyring } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import Step0 from '../components/GenerateWallet/Step0';

const genesisHash = '0x50dd5d206917bf10502c68fb4d18a59fc8aa31586f4e8856b493e43544aa82aa';

const GenerateWallet: FC = () => {
  const [step, nextStep, , setStep] = useStepper();
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

  const cancel = useCallback(() => {
    setStep(1);
    setMnemonics(['', '']);
  }, [setStep]);

  

  return (
    <Container maxWidth='md' sx={{ py: 6 }}>
      {step === 1 && <Step0 onFinish={nextStep} />}
      {step === 2 && <Step1 onFinish={nextStep} cancel={cancel} setMnemonics={setMnemonics} />}
      {step === 3 && <Step2 mnemonics={mnemonics} cancel={cancel} onFinish={onMnemonicsFinish} />}
      {step === 4 && <Step3 keypair={keypair} keyring={keyring} />}
    </Container>
  );
};

export default GenerateWallet;
