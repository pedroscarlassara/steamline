"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStorage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const STORAGE_FILE = path_1.default.join(__dirname, '..', 'accounts.json');
class AccountStorage {
    constructor() {
        this.accounts = new Map();
        this.load();
    }
    load() {
        try {
            if (fs_1.default.existsSync(STORAGE_FILE)) {
                const data = JSON.parse(fs_1.default.readFileSync(STORAGE_FILE, 'utf-8'));
                this.accounts = new Map(Object.entries(data));
            }
        }
        catch (err) {
            console.error('Erro ao carregar contas:', err);
        }
    }
    save() {
        try {
            const data = Object.fromEntries(this.accounts);
            fs_1.default.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
        }
        catch (err) {
            console.error('Erro ao salvar contas:', err);
        }
    }
    addAccount(username, password, discordId) {
        this.accounts.set(username, { username, password, discordId });
        this.save();
    }
    removeAccount(username) {
        this.accounts.delete(username);
        this.save();
    }
    getAccount(username) {
        return this.accounts.get(username);
    }
    getUserAccounts(discordId) {
        return Array.from(this.accounts.values()).filter(acc => acc.discordId === discordId);
    }
    getAllAccounts() {
        return Array.from(this.accounts.values());
    }
}
exports.AccountStorage = AccountStorage;
