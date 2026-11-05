import { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { ExternalLink } from '../components/ExternalLink';
import { SiteDialog } from '../components/SiteDialog';
import type { Certification } from '../types';
import './certificate-dialog.css';

const certificateImage=(cert:Certification)=>cert.image||cert.certificate_image;
const credentialLink=(cert:Certification)=>cert.credential_url||cert.verification_url;
const issueDate=(cert:Certification,english:boolean)=>cert.issue_date instanceof Date
  ? cert.issue_date.toLocaleDateString(english?'en-GB':'it-IT',{month:'long',year:'numeric'}) : cert.issue_date;

export function CertificateDialog({certificate,onClose}:{certificate:Certification;onClose:()=>void}) {
  const {copy,isEnglish}=usePortfolio();
  const [failed,setFailed]=useState(false);
  const image=certificateImage(certificate);
  return <SiteDialog id="certificate-preview" title={certificate.title} intro={certificate.issuing_organization} open onClose={onClose}>

    <div className="certificate-preview-image">
      {image&&!failed?<img src={image} alt={`${copy.viewCertificate}: ${certificate.title} — ${certificate.issuing_organization}`} onError={()=>setFailed(true)} draggable={false}/>:<p role="status">{isEnglish?'The certificate could not be loaded. Close this window and try again.':'Impossibile caricare l’attestato. Chiudi questa finestra e riprova.'}</p>}
    </div>
    <div className="certificate-details"><p className="certificate-issued">{isEnglish?'Issued':'Data di rilascio'}: {issueDate(certificate,isEnglish)}</p>{certificate.description&&<p>{certificate.description}</p>}{credentialLink(certificate)&&<ExternalLink className="button button-accent-outline" href={credentialLink(certificate)}>{copy.verify}</ExternalLink>}</div>
  </SiteDialog>;
}
