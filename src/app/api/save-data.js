import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const { vehicles } = req.body;

    for (const v of vehicles) {
      await query(
        "INSERT INTO autooleo_data (name, oil, filter) VALUES (?, ?, ?)",
        [v.name, v.oil, v.filter]
      );
    }

    return res.status(200).json({
      success: true,
      inserted: vehicles.length
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.toString() });
  }
}
