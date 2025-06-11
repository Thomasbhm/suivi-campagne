import React, { useEffect, useState } from "react";
import { request } from "graphql-request";

const API_URL = "https://graphql.emelia.io/graphql";
const API_KEY = "QzEH81tPCPigkWt2dOLNxP996aTqEvCbTq5mAGdQy6zKBR4D";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};

const App = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    request(API_URL, `
      query {
        campaigns {
          _id
          name
        }
      }
    `, {}, headers).then(data => {
      setCampaigns(data.campaigns);
    });
  }, []);

  useEffect(() => {
    if (selected) {
      request(API_URL, `
        query {
          get_email_campaign_statistics(campaignId: "${selected}") {
            sent
            replied
            bounced
            unsubscribed
          }
        }
      `, {}, headers).then(data => {
        setStats(data.get_email_campaign_statistics);
      });
    }
  }, [selected]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Suivi Campagne</h1>
      <label>Choisir une campagne :</label>
      <select onChange={(e) => setSelected(e.target.value)} style={{ marginLeft: 10 }}>
        <option value="">--</option>
        {campaigns.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      {stats && (
        <div style={{ marginTop: 20 }}>
          <h2>KPI Campagne</h2>
          <p>📤 Emails envoyés : {stats.sent}</p>
          <p>💬 Réponses : {stats.replied}</p>
          <p>❌ Bounces : {stats.bounced}</p>
          <p>🚫 Désabonnements : {stats.unsubscribed}</p>
        </div>
      )}
    </div>
  );
};

export default App;