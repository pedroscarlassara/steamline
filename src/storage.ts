import fs from 'fs';
import path from 'path';

interface AccountData {
    username: string;
    password: string;
    discordId: string;
}

const STORAGE_FILE = path.join(__dirname, '..', 'accounts.json');

export class AccountStorage {
    private accounts: Map<string, AccountData> = new Map();

    constructor() {
        this.load();
    }

    private load() {
        try {
            if (fs.existsSync(STORAGE_FILE)) {
                const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
                this.accounts = new Map(Object.entries(data));
            }
        } catch (err) {
            console.error('Erro ao carregar contas:', err);
        }
    }

    private save() {
        try {
            const data = Object.fromEntries(this.accounts);
            fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error('Erro ao salvar contas:', err);
        }
    }

    addAccount(username: string, password: string, discordId: string) {
        this.accounts.set(username, { username, password, discordId });
        this.save();
    }

    removeAccount(username: string) {
        this.accounts.delete(username);
        this.save();
    }

    getAccount(username: string): AccountData | undefined {
        return this.accounts.get(username);
    }

    getUserAccounts(discordId: string): AccountData[] {
        return Array.from(this.accounts.values()).filter(acc => acc.discordId === discordId);
    }

    getAllAccounts(): AccountData[] {
        return Array.from(this.accounts.values());
    }
}
