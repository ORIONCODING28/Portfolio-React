import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import './page-back-button.css';

export function PageBackButton() {
  const navigate=useNavigate();
  const location=useLocation();
  const {isEnglish}=usePortfolio();
  const goBack=()=>{
    if(location.key==='default')navigate('/',{replace:true});
    else navigate(-1);
  };
  return <button type="button" className="page-back-button" onClick={goBack}><ArrowLeft size={18} aria-hidden="true" />{isEnglish?'Go back':'Torna indietro'}</button>;
}
