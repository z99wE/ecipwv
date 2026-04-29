import type { User } from "firebase/auth";

describe('Service Layer Interfaces', () => {
  describe('AuthService Types', () => {
    test('VoterProfile interface structure', () => {
      const profile = {
        uid: 'test-uid-123',
        email: 'voter@example.com',
        displayName: 'Test Voter',
        photoURL: 'https://example.com/photo.jpg',
        lastLogin: null,
        createdAt: null,
        totalQueries: 5,
        lastQueryTopic: 'EVM procedure',
      };
      
      expect(profile.uid).toBe('test-uid-123');
      expect(profile.email).toBe('voter@example.com');
      expect(profile.totalQueries).toBe(5);
    });

    test('AuthResult interface structure', () => {
      const result = {
        user: { uid: 'user-123', email: 'test@test.com' } as User,
        isNewUser: false,
        profile: {
          uid: 'user-123',
          email: 'test@test.com',
          displayName: null,
          photoURL: null,
          lastLogin: null,
          createdAt: null,
        },
      };
      
      expect(result.isNewUser).toBe(false);
      expect(result.profile.uid).toBe('user-123');
    });
  });

  describe('FirestoreService Types', () => {
    test('ChatMessage interface structure', () => {
      const message = {
        id: 'msg-abc123',
        uid: 'user-xyz',
        role: 'user' as const,
        content: 'How do I register to vote?',
        topic: 'voter registration',
        createdAt: null,
      };
      
      expect(message.id).toBe('msg-abc123');
      expect(message.role).toBe('user');
      expect(message.content).toContain('register');
    });

    test('ElectionDataRecord interface structure', () => {
      const record = {
        id: 'rec-001',
        source: 'ECI',
        topic: 'voting-age',
        content: 'Minimum voting age is 18 years',
        fetchedAt: null,
      };
      
      expect(record.source).toBe('ECI');
      expect(record.topic).toBe('voting-age');
    });
  });

  describe('AIService Types', () => {
    test('VotiResponse interface structure', () => {
      const response = {
        text: 'You can register online via the NVSP portal.',
        hasInfographic: true,
        infographicTopic: 'voter registration process',
      };
      
      expect(response.text).toContain('register');
      expect(response.hasInfographic).toBe(true);
    });

    test('AIInteractionEvent interface structure', () => {
      const event = {
        eventName: 'voti_interaction',
        uid: 'user-789',
        queryLength: 45,
        responseLength: 120,
        type: 'chat' as const,
        topic: 'booth locator',
      };
      
      expect(event.eventName).toBe('voti_interaction');
      expect(event.type).toBe('chat');
      expect(event.queryLength).toBe(45);
    });

    test('Myth-Bust event type', () => {
      const event = {
        eventName: 'mythbust_interaction',
        uid: 'user-456',
        queryLength: 30,
        type: 'mythbust' as const,
        topic: 'EVM hacking claim',
      };
      
      expect(event.eventName).toBe('mythbust_interaction');
      expect(event.type).toBe('mythbust');
    });

    test('Infographic event type', () => {
      const event = {
        eventName: 'infographic_generated',
        uid: 'user-111',
        type: 'infographic' as const,
        topic: 'VVPAT explanation',
      };
      
      expect(event.eventName).toBe('infographic_generated');
      expect(event.type).toBe('infographic');
    });
  });

  describe('Firebase Config Type', () => {
    test('FirebaseConfig interface structure', () => {
      const config = {
        apiKey: 'AIzaSy*************',
        authDomain: 'project.firebaseapp.com',
        projectId: 'project-id',
        storageBucket: 'project.appspot.com',
        messagingSenderId: '123456789',
        appId: '1:123456789:web:abc123',
        measurementId: 'G-XXXXXXXXXX',
      };
      
      expect(config.projectId).toBe('project-id');
      expect(config.measurementId).toBe('G-XXXXXXXXXX');
    });
  });

  describe('Gemini Config Type', () => {
    test('SafetySettings structure', () => {
      const settings = [
        { category: 'HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ];
      
      expect(settings.length).toBe(4);
      expect(settings[0].category).toBe('HARASSMENT');
    });
  });
});
