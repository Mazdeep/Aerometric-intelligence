import { AirportMetar, AirportRole } from '../types';
import { decodeMetar } from '../metarDecode';

/* Add own USER ID */
const USER_ID = '1149288';
const BASE_URL = `https://www.simbrief.com/api/xml.fetcher.php?userid=${USER_ID}`;

export async function fetchPlan(): Promise<Document> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`SimBrief request failed: ${response.status}`);
  }
  const xmlText = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  return doc;
}

export function parseMetars(doc: Document): AirportMetar[] {
  const airports: AirportMetar[] = [];

  const origin = doc.querySelector('origin');
  if (origin) {
    const metar = extractAirport(origin, 'departure');
    if (metar) airports.push(metar);
  }

  const destination = doc.querySelector('destination');
  if (destination) {
    const metar = extractAirport(destination, 'destination');
    if (metar) airports.push(metar);
  }

  const alternates = Array.from(doc.querySelectorAll('alternate'));
  alternates.forEach((alt) => {
    const metar = extractAirport(alt, 'alternate');
    if (metar) airports.push(metar);
  });

  return airports;
}

function extractAirport(node: Element, role: AirportRole): AirportMetar | null {
  const icao = textContent(node, 'icao_code') || textContent(node, 'icao');
  const name = textContent(node, 'name') || undefined;
  const metarRaw = textContent(node, 'metar');
  const metarTime = textContent(node, 'metar_time') || undefined;
  const metarCategory = textContent(node, 'metar_category') || undefined;
  const metarVisibility = textContent(node, 'metar_visibility') || undefined;
  const metarCeiling = textContent(node, 'metar_ceiling') || undefined;

  if (!icao || !metarRaw) return null;

  const decoded = decodeMetar(metarRaw);

  return {
    role,
    icao,
    name,
    metarRaw,
    metarTime,
    metarCategory,
    metarVisibility,
    metarCeiling,
    decoded,
  };
}

function textContent(node: Element, selector: string): string | null {
  const child = node.querySelector(selector);
  return child?.textContent?.trim() || null;
}
