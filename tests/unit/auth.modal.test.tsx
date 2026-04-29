import type { User } from "firebase/auth";
import type { VoterProfile } from "@/services/auth.service";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthModal } from "@/components/ui/AuthModal";
import { useAuth } from "@/context/AuthContext";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockSignInWithGoogle = jest.fn();
const mockSignInAnonymously = jest.fn();
const mockSignInWithEmail = jest.fn();
const mockRegisterWithEmail = jest.fn();

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUser = null as User | null;
const mockProfile = null as VoterProfile | null;

beforeEach(() => {
  jest.resetAllMocks();
  mockedUseAuth.mockReturnValue({
    user: mockUser,
    profile: mockProfile,
    loading: false,
    signInWithGoogle: mockSignInWithGoogle,
    signInAnonymously: mockSignInAnonymously,
    signInWithEmail: mockSignInWithEmail,
    registerWithEmail: mockRegisterWithEmail,
    logout: jest.fn(),
    isAuthenticated: false,
  });
});

describe("AuthModal", () => {
  test("calls Google sign-in when the Google button is clicked", async () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Continue with Google/i }));

    await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalled());
  });

  test("renders email login form and calls email sign-in", async () => {
    const onClose = jest.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /Email & Password/i }));

    await waitFor(() => expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), {
      target: { value: "tester@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => expect(mockSignInWithEmail).toHaveBeenCalledWith("tester@example.com", "password123"));
    expect(onClose).toHaveBeenCalled();
  });

  test("calls anonymous sign-in when the anonymous button is clicked", async () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Continue Anonymously/i }));

    await waitFor(() => expect(mockSignInAnonymously).toHaveBeenCalled());
  });
});
