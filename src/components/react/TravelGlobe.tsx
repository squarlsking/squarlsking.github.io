import { useEffect, useRef } from 'react';

interface TravelLocation {
  lat: number;
  lng: number;
  label: string;
}

interface TravelArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

const travelLocations: TravelLocation[] = [
  { lat: 45.8038, lng: 126.5349, label: '哈尔滨' },
  { lat: 44.5833, lng: 129.6, label: '牡丹江' },
  { lat: 41.8057, lng: 123.4315, label: '沈阳' },
  { lat: 39.9042, lng: 116.4074, label: '北京' },
  { lat: 32.0603, lng: 118.7969, label: '南京' },
  { lat: 24.4798, lng: 118.0894, label: '厦门' },
  { lat: 23.1291, lng: 113.2644, label: '广州' },
  { lat: 22.5431, lng: 114.0579, label: '深圳' },
  { lat: 30.5728, lng: 104.0668, label: '成都' },
  { lat: 34.3416, lng: 108.9398, label: '西安' },
  { lat: 29.6525, lng: 91.1721, label: '拉萨' },
  { lat: 30.2741, lng: 120.1551, label: '杭州' },
  { lat: 25.033, lng: 121.5654, label: '台湾' },
  { lat: 35.6762, lng: 139.6503, label: '东京' },
  { lat: 34.6937, lng: 135.5023, label: '大阪' }
];

const cityByName = Object.fromEntries(
  travelLocations.map((city) => [city.label, city])
) as Record<string, TravelLocation>;

const buildArc = (from: string, to: string): TravelArc | null => {
  const start = cityByName[from];
  const end = cityByName[to];

  if (!start || !end || from === to) {
    return null;
  }

  return {
    startLat: start.lat,
    startLng: start.lng,
    endLat: end.lat,
    endLng: end.lng
  };
};

// 以杭州为主出发点，补充少量深圳出发线路。
const hangzhouFirstRoutes = [
  ['杭州', '哈尔滨'],
  ['杭州', '牡丹江'],
  ['杭州', '沈阳'],
  ['杭州', '北京'],
  ['杭州', '南京'],
  ['杭州', '厦门'],
  ['杭州', '广州'],
  ['杭州', '成都'],
  ['杭州', '西安'],
  ['杭州', '拉萨'],
  ['杭州', '台湾'],
  ['杭州', '东京'],
  ['杭州', '大阪']
] as const;

const shenzhenRoutes = [
  ['深圳', '广州'],
  ['深圳', '厦门'],
  ['深圳', '东京'],
  ['深圳', '大阪']
] as const;

const travelArcs: TravelArc[] = [...hangzhouFirstRoutes, ...shenzhenRoutes]
  .map(([from, to]) => buildArc(from, to))
  .filter((arc): arc is TravelArc => Boolean(arc));

export default function TravelGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let globe: any;
    let onResize: (() => void) | undefined;

    const init = async () => {
      if (!containerRef.current) {
        return;
      }

      const module = await import('globe.gl');
      const Globe = module.default;

      if (!mounted || !containerRef.current) {
        return;
      }

      const gold = '#ffd86b';
      const ringBaseColor = '255,216,107';

      globe = Globe()(containerRef.current)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .showAtmosphere(true)
        .atmosphereColor(gold)
        .atmosphereAltitude(0.18)
        .ringsData(travelLocations)
        .ringLat((d) => (d as TravelLocation).lat)
        .ringLng((d) => (d as TravelLocation).lng)
        .ringColor(() => (t: number) => `rgba(${ringBaseColor}, ${0.82 * (1 - t)})`)
        .ringMaxRadius(3.6)
        .ringPropagationSpeed(0.8)
        .ringRepeatPeriod(1500)
        .arcsData(travelArcs)
        .arcStartLat((d) => (d as TravelArc).startLat)
        .arcStartLng((d) => (d as TravelArc).startLng)
        .arcEndLat((d) => (d as TravelArc).endLat)
        .arcEndLng((d) => (d as TravelArc).endLng)
        .arcColor(() => [gold, gold])
        .arcAltitude(0.16)
        .arcStroke(0.65)
        .arcDashLength(0.24)
        .arcDashGap(1.1)
        .arcDashAnimateTime(3200)
        .labelsData(travelLocations)
        .labelLat((d) => (d as TravelLocation).lat)
        .labelLng((d) => (d as TravelLocation).lng)
        .labelText((d) => (d as TravelLocation).label)
        .labelColor(() => (isNightTheme ? '#e2e8f0' : '#334155'))
        .labelDotRadius(0.2)
        .labelSize(0.65)
        .labelResolution(2);

      globe.width(containerRef.current.clientWidth);
      globe.height(440);
      globe.pointOfView({ lat: 28, lng: 108, altitude: 1.95 }, 1000);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.24;
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.minDistance = 120;
      controls.maxDistance = 380;

      onResize = () => {
        if (!containerRef.current || !globe) {
          return;
        }

        globe.width(containerRef.current.clientWidth);
      };

      window.addEventListener('resize', onResize);
    };

    void init();

    return () => {
      mounted = false;
      if (onResize) {
        window.removeEventListener('resize', onResize);
      }
      if (globe && typeof globe._destructor === 'function') {
        globe._destructor();
      }
    };
  }, []);

  return <div ref={containerRef} className="h-[440px] w-full" />;
}
