import { Vec3 } from "vec3"
import { Block } from 'prismarine-block'
import { BedrockChunk, CommonChunk, ExtendedBlock } from 'prismarine-chunk'
import chunk from 'prismarine-chunk'
import morton_2d from 'morton'
import { latestRegistries } from 'data-registries'
import { EventEmitter } from 'events'
import { Entity, EntityType } from "prismarine-entity"

export type ChunkCoord = number // >> 4 shifted
export type ChunkPosition = {
	x: ChunkCoord,
	z: ChunkCoord
}

export interface WorldBlockDataProvider {
	getBlock(position: Vec3, full?: boolean): Block
}

export interface IChunkGenerator {
	generate(x: ChunkCoord, z: ChunkCoord, chunkType: typeof BedrockChunk): BedrockChunk

	make(x: number, y: number, z: number, chunk: BedrockChunk, blockType: typeof Block): Block
}

export class EmptyChunkGenerator implements IChunkGenerator {
	generate(x: number, z: number, chunkType: typeof BedrockChunk): BedrockChunk

	make(x: number, y: number, z: number, chunk: BedrockChunk, blockType: typeof Block): Block
}

export class World extends EventEmitter implements WorldBlockDataProvider {

	chunks: BedrockChunk[]
	_entities: Map<number, Entity>
	_players: Map<number, Entity>

	_defaultChunkGenerator: IChunkGenerator

	constructor(defaultChunkGenerator: IChunkGenerator)

	addEntity(entity: Entity): void

	getEntity(id: number): Entity | null

	getPlayer(id: number): Entity | null

	toChunkCoord(v: number): ChunkCoord

	toChunkPosition(v: { x: number, z: number }): ChunkPosition

	getChunkHash(x: ChunkCoord, z: ChunkCoord): number

	getChunkFrom(x: number, z: number): BedrockChunk

	getChunk(x: ChunkCoord, z: ChunkCoord): BedrockChunk

	_setChunk(x: ChunkCoord, z: ChunkCoord, chunk: BedrockChunk, overwrite?: boolean): void

	getBlock(position: Vec3, full?: boolean): Block

	setBlock(position: Vec3, block: ExtendedBlock): void
}
