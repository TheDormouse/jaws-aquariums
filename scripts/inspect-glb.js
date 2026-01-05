/**
 * GLB Inspector Script
 * Analyzes the structure of a GLB file to understand its nodes, meshes, and animations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const glbPath = path.join(__dirname, '..', 'public', 'great_white_shark.glb');

// Read the GLB file
const buffer = fs.readFileSync(glbPath);

// GLB magic number check
const magic = buffer.toString('ascii', 0, 4);
if (magic !== 'glTF') {
  console.error('Not a valid GLB file');
  process.exit(1);
}

// Parse GLB header
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

console.log('🦈 GLB File Inspector');
console.log('=====================');
console.log(`File: ${glbPath}`);
console.log(`Size: ${(buffer.length / 1024).toFixed(2)} KB`);
console.log(`glTF Version: ${version}`);
console.log(`Total Length: ${length} bytes`);
console.log('');

// Parse chunks
let offset = 12;
let jsonChunk = null;

while (offset < buffer.length) {
  const chunkLength = buffer.readUInt32LE(offset);
  const chunkType = buffer.readUInt32LE(offset + 4);
  
  if (chunkType === 0x4E4F534A) { // JSON chunk
    const jsonData = buffer.slice(offset + 8, offset + 8 + chunkLength);
    jsonChunk = JSON.parse(jsonData.toString('utf8'));
  }
  
  offset += 8 + chunkLength;
}

if (!jsonChunk) {
  console.error('No JSON chunk found in GLB');
  process.exit(1);
}

// Analyze the glTF JSON
console.log('📦 GLTF Structure:');
console.log('------------------');

// Asset info
if (jsonChunk.asset) {
  console.log('\n🏷️  Asset Info:');
  console.log(`  Generator: ${jsonChunk.asset.generator || 'Unknown'}`);
  console.log(`  Version: ${jsonChunk.asset.version}`);
}

// Scenes
if (jsonChunk.scenes) {
  console.log(`\n🎬 Scenes: ${jsonChunk.scenes.length}`);
  jsonChunk.scenes.forEach((scene, i) => {
    console.log(`  [${i}] ${scene.name || 'Unnamed'} - Nodes: ${scene.nodes?.join(', ') || 'none'}`);
  });
}

// Nodes (the scene graph)
if (jsonChunk.nodes) {
  console.log(`\n🌳 Nodes: ${jsonChunk.nodes.length}`);
  jsonChunk.nodes.forEach((node, i) => {
    const info = [];
    if (node.mesh !== undefined) info.push(`mesh:${node.mesh}`);
    if (node.skin !== undefined) info.push(`skin:${node.skin}`);
    if (node.children) info.push(`children:[${node.children.join(',')}]`);
    if (node.translation) info.push(`pos:[${node.translation.map(v => v.toFixed(2)).join(',')}]`);
    if (node.rotation) info.push(`rot:[${node.rotation.map(v => v.toFixed(2)).join(',')}]`);
    if (node.scale) info.push(`scale:[${node.scale.map(v => v.toFixed(2)).join(',')}]`);
    
    console.log(`  [${i}] "${node.name || 'Unnamed'}" ${info.join(' ')}`);
  });
}

// Meshes
if (jsonChunk.meshes) {
  console.log(`\n🔷 Meshes: ${jsonChunk.meshes.length}`);
  jsonChunk.meshes.forEach((mesh, i) => {
    console.log(`  [${i}] "${mesh.name || 'Unnamed'}" - Primitives: ${mesh.primitives?.length || 0}`);
  });
}

// Materials
if (jsonChunk.materials) {
  console.log(`\n🎨 Materials: ${jsonChunk.materials.length}`);
  jsonChunk.materials.forEach((mat, i) => {
    const pbr = mat.pbrMetallicRoughness;
    const color = pbr?.baseColorFactor ? 
      `rgba(${pbr.baseColorFactor.map(v => Math.round(v * 255)).join(',')})` : 
      'default';
    console.log(`  [${i}] "${mat.name || 'Unnamed'}" - Color: ${color}`);
  });
}

// Animations (THIS IS WHAT WE NEED!)
if (jsonChunk.animations && jsonChunk.animations.length > 0) {
  console.log(`\n🎭 Animations: ${jsonChunk.animations.length}`);
  jsonChunk.animations.forEach((anim, i) => {
    console.log(`  [${i}] "${anim.name || 'Unnamed'}"`);
    console.log(`      Channels: ${anim.channels?.length || 0}`);
    console.log(`      Samplers: ${anim.samplers?.length || 0}`);
    
    // Show what nodes are animated
    if (anim.channels) {
      const targetNodes = [...new Set(anim.channels.map(c => c.target?.node))];
      console.log(`      Target Nodes: ${targetNodes.join(', ')}`);
      
      // Show animation types
      const paths = [...new Set(anim.channels.map(c => c.target?.path))];
      console.log(`      Properties: ${paths.join(', ')}`);
    }
  });
} else {
  console.log('\n🎭 Animations: NONE');
}

// Skins (for skeletal animation)
if (jsonChunk.skins) {
  console.log(`\n🦴 Skins (Skeletons): ${jsonChunk.skins.length}`);
  jsonChunk.skins.forEach((skin, i) => {
    console.log(`  [${i}] "${skin.name || 'Unnamed'}" - Joints: ${skin.joints?.length || 0}`);
    if (skin.skeleton !== undefined) {
      console.log(`      Root Joint: Node ${skin.skeleton}`);
    }
  });
}

// Textures
if (jsonChunk.textures) {
  console.log(`\n🖼️  Textures: ${jsonChunk.textures.length}`);
}

// Images
if (jsonChunk.images) {
  console.log(`\n📷 Images: ${jsonChunk.images.length}`);
  jsonChunk.images.forEach((img, i) => {
    console.log(`  [${i}] ${img.name || img.uri || 'embedded'} - ${img.mimeType || 'unknown type'}`);
  });
}

console.log('\n=====================');
console.log('✅ Inspection Complete');

// Export useful info for the component
console.log('\n📋 For React Three Fiber:');
console.log('---------------------------');
if (jsonChunk.animations && jsonChunk.animations.length > 0) {
  console.log('Animation names to use with useAnimations():');
  jsonChunk.animations.forEach((anim, i) => {
    console.log(`  actions['${anim.name || `Animation_${i}`}']`);
  });
}
if (jsonChunk.nodes) {
  const rootNodes = jsonChunk.scenes?.[0]?.nodes || [0];
  console.log(`\nRoot nodes: ${rootNodes.join(', ')}`);
  console.log('Access via: const { nodes, materials, animations } = useGLTF("/great_white_shark.glb")');
}


