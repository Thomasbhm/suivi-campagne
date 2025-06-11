import React, { useEffect, useState } from "react";
import { request } from "graphql-request";
import "antd/dist/reset.css";

const API_URL = "https://graphql.emelia.io/graphql";
const API_KEY = "QzEH81tPCPigkWt2dOLNxP996aTqEvCbTq5mAGdQy6zKBR4D";

const REST_STATS_URL = "https://graphql.emelia.io/stats";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

const App = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Fetch list of campaigns
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
        console.error(err);
        setError("Erreur lors du chargement des campagnes.");
      }
    };
    fetchCampaigns();
  }, []);

  // Fetch stats for selected campaign
  useEffect(() => {
    if (!selected) return;

    const fetchStats = async () => {
      setError(null);
      setStats(null);
      try {
        const response = await fetch(
          `${REST_STATS_URL}?campaignId=${selected}&detailed=true`,
          { headers }
        );

        if (!response.ok) {
          throw new Error("Erreur réseau");
        }

        const data = await response.json();
        const global = data[0]?.global;
        if (!global) {
          throw new Error("Données statistiques introuvables");
        }

        setStats({
          sent: global.sent,
          replied: global.replied,
          bounced: global.bounced,
          unsubscribed: global.unsubscribed,
        });
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des KPI.");
      }
    };

    fetchStats();
  }, [selected]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Suivi Campagne</h1>

      {error && (
        <p style={{ color: "red", marginBottom: 20 }}>{error}</p>
      )}

      <label htmlFor="campaign-select">Choisir une campagne :</label>
      <select
        id="campaign-select"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ marginLeft: 10, padding: 4 }}
      >
        <option value="">--</option>
        {campaigns.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {stats && (
        <div style={{ marginTop: 30 }}>
          <h2>KPI Globaux</h2>
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
