import { useParams } from 'react-router-dom';

export default function OrganizationProfile() {
  const { slug } = useParams();
  return (
    <div>
      <h2>Organization Profile</h2>
      <p>Profile for organization: <b>{slug}</b></p>
    </div>
  );
}
