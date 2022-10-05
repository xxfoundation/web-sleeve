import React, { FC, useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';

import useStepper from '../../hooks/useStepper';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import useNavigatorOnline from '../../hooks/useNavOnline';
import { Container } from '@mui/material';

const GenerateWallet: FC = () => {
  const { isOnline } = useNavigatorOnline();
  const [step, nextStep, , setStep] = useStepper();
  const { enqueueSnackbar } = useSnackbar();
  const [mnemonics, setMnemonics] = useState<string[]>(['', '']);

  const onFinish = () => {
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
  };

  const cancel = useCallback(() => {
    setStep(1);
    setMnemonics(['', '']);
  }, [setStep]);

  return (
    <Container maxWidth='sm' sx={{ py: 6 }}>
      {step === 1 && <Step1 onFinish={nextStep} setMnemonics={setMnemonics} />}
      {step === 2 && <Step2 mnemonics={mnemonics} cancel={cancel} onFinish={nextStep} />}
      {step === 3 && <Step3 onFinish={onFinish} standardMnemonic={mnemonics[0]} />}
    </Container>
  );
};

export default GenerateWallet;
