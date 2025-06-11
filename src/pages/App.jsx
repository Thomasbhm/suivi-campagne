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
  const [selected, setSelected] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await request(
          API_URL,
          `
            query {
              campaigns {
                _id
                name
              }
            }
          `,
          {},
          headers
        );
        setCampaigns(data.campaigns);
      } catch (err) {
        setError("Erreur lors du chargement des campagnes.");
        console.error(err);
      }
    };
    fetchCampaigns();
  }, []);

useEffect(() => {
  if (!selected) return;

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://graphql.emelia.io/stats?campaignId=${selected}&detailed=true`,
        {
          headers: {
            Authorization: "xRCRPFCWM7z7T3hxX5AkA1TPW6oIxpNi1tpebL9iX5G4VI",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des stats");
      }

      const data = await response.json();

      // Attention : adapter selon la structure de `data`
      setStats({
        sent: data.sent || 0,
        replied: data.replied || 0,
        bounced: data.bounced || 0,
        unsubscribed: data.unsubscribed || 0,
      });
    } catch (err) {
      setError("Erreur lors du chargement des KPI.");
      console.error(err);
    }
  };

  fetchStats();
}, [selected]);


  return (
    <div style={{ padding: 20 }}>
      <h1>Suivi Campagne</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Choisir une campagne :</label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ marginLeft: 10 }}
      >
        <option value="">--</option>
        {campaigns.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
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
