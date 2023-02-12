"use strict";
var __extends = (this && this.__extends) || (function () {
	var extendStatics = function (d, b) {
		extendStatics = Object.setPrototypeOf ||
			({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
			function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
		return extendStatics(d, b);
	};
	return function (d, b) {
		if (typeof b !== "function" && b !== null)
			throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
		extendStatics(d, b);
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
})();
exports.__esModule = true;
exports.World = exports.EmptyChunkGenerator = void 0;
var morton_1 = require("morton");
var data_registries_1 = require("data-registries");
var events_1 = require("events");
var EmptyChunkGenerator = /** @class */ (function () {
	function EmptyChunkGenerator() {
	}
	EmptyChunkGenerator.prototype.generate = function (x, z, chunkType) {
		return new chunkType({ x: x, z: z });
	};
	return EmptyChunkGenerator;
}());
exports.EmptyChunkGenerator = EmptyChunkGenerator;
var World = /** @class */ (function (_super) {
	__extends(World, _super);
	function World(defaultChunkGenerator) {
		var _this = _super.call(this) || this;
		_this.chunks = [];
		_this._entities = new Map();
		_this._players = new Map();
		_this._defaultChunkGenerator = defaultChunkGenerator;
		return _this;
	}
	World.prototype.addEntity = function (entity) {
		this._entities.set(entity.id, entity);
		if (entity.type == 'player') {
			this._players.set(entity.id, entity);
		}
		this.emit("entity_add", entity);
	};
	World.prototype.getEntity = function (id) {
		var _a;
		return (_a = this._entities.get(id)) !== null && _a !== void 0 ? _a : null;
	};
	World.prototype.getPlayer = function (id) {
		var _a;
		return (_a = this._players.get(id)) !== null && _a !== void 0 ? _a : null;
	};
	World.prototype.toChunkCoord = function (v) {
		return Math.floor(v) >> 4;
	};
	World.prototype.toChunkPosition = function (v) {
		return { x: this.toChunkCoord(v.x), z: this.toChunkCoord(v.z) };
	};
	World.prototype.getChunkHash = function (x, z) {
		return morton_1(x, z);
	};
	World.prototype.getChunkFrom = function (x, z) {
		return this.getChunk(this.toChunkCoord(x), this.toChunkCoord(z));
	};
	World.prototype.getChunk = function (x, z) {
		var hash = this.getChunkHash(x, z);
		var chunk = this.chunks[hash];
		if (chunk == null) {
			var newChunk = this._defaultChunkGenerator.generate(x, z, data_registries_1.latestRegistries.chunk);
			this._setChunk(x, z, newChunk);
			return newChunk;
		}
		return chunk;
	};
	World.prototype._setChunk = function (x, z, chunk, overwrite) {
		var hash = this.getChunkHash(x, z);
		if (!overwrite && this.chunks[hash]) {
			throw Error("cannot overwrite");
		}
		this.chunks[hash] = chunk;
	};
	World.prototype.getBlock = function (position, full) {
		var floorPos = position.floor();
		var chunk = this.getChunkFrom(floorPos.x, floorPos.y);
		return chunk.getBlock(floorPos, full);
	};
	World.prototype.setBlock = function (position, block) {
		var floorPos = position.floor();
		block.position = floorPos.clone();
		var chunk = this.getChunkFrom(floorPos.x, floorPos.y);
		var oldBlock = chunk.getBlock(floorPos);
		chunk.setBlock(floorPos, block);
		this.emit("block_changed", chunk, block, oldBlock);
	};
	return World;
}(events_1.EventEmitter));
exports.World = World;
