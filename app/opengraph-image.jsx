import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'JAWS Aquariums - Custom Luxury Aquarium Design & Installation';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #0a1628 0%, #0d2847 50%, #1e5b94 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Water wave overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '40%',
            background: 'linear-gradient(0deg, rgba(46,155,186,0.4) 0%, transparent 100%)',
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#f7f9fc',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex',
            }}
          >
            Just Add{' '}
            <span style={{ color: '#4ecdc4', marginLeft: 16 }}>Water</span>
          </div>
          
          <div
            style={{
              fontSize: 28,
              color: '#f0e6d3',
              letterSpacing: '0.2em',
              marginTop: 24,
              textTransform: 'uppercase',
            }}
          >
            Custom Aquarium Design & Installation
          </div>
          
          <div
            style={{
              fontSize: 22,
              color: 'rgba(247, 249, 252, 0.7)',
              marginTop: 32,
            }}
          >
            Atlanta&apos;s Premier Aquatic Artisans Since 1989
          </div>
        </div>

        {/* Decorative shark fin silhouette */}
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 0,
            height: 0,
            borderLeft: '40px solid transparent',
            borderRight: '40px solid transparent',
            borderBottom: '80px solid rgba(10,22,40,0.5)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}


