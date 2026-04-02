const { AI_CONFIG } = require('../src/ai/ai.service');

/**
 * AI Configuration Test Suite
 * Validates that the AI service correctly generates contextual prompts 
 * based on varying club scenarios.
 */

describe('AI Config Context Matching', () => {
    test('health schema should include club name and activity description', () => {
        const context = "Club: GDG Baku. Description: Developer group.";
        const desc = "Regular workshops";
        const name = "GDG Baku";
        
        const prompt = AI_CONFIG.health.schema(context, desc, name);
        
        expect(prompt).toContain(name);
        expect(prompt).toContain(desc);
        expect(prompt).toContain("Return JSON");
    });

    test('planner schema should generate correct event context', () => {
        const context = "Club: AI Club. Members: Davud, John.";
        const desc = "Hackathon";
        const name = "AI Club";
        
        const prompt = AI_CONFIG.planner.schema(context, desc, name);
        
        expect(prompt).toContain(name);
        expect(prompt).toContain(desc);
    });

    test('connect schema should handle member lists', () => {
        const context = "Club: Tech Baku.";
        const members = [{ name: "Alice", interests: ["AI"] }, { name: "Bob", interests: ["Web"] }];
        
        const prompt = AI_CONFIG.connect.schema(context, members);
        
        expect(prompt).toContain("Alice");
        expect(prompt).toContain("Bob");
    });
});
