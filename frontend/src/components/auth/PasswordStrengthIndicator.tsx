/**
 * Password strength indicator component
 */
import React from 'react';

interface PasswordStrengthProps {
  password: string;
  show?: boolean;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function PasswordStrengthIndicator({ password, show = true }: PasswordStrengthProps) {
  if (!show || !password) return null;

  // Check requirements
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      label: 'One number',
      met: /[0-9]/.test(password),
    },
    {
      label: 'One special character',
      met: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;~`]/.test(password),
    },
  ];

  // Calculate strength
  const metCount = requirements.filter(req => req.met).length;
  const strengthPercentage = (metCount / requirements.length) * 100;

  // Determine strength level
  let strengthLevel: 'weak' | 'fair' | 'good' | 'strong';
  let strengthText: string;
  let strengthColor: string;

  if (metCount <= 2) {
    strengthLevel = 'weak';
    strengthText = 'Weak';
    strengthColor = 'bg-red-500';
  } else if (metCount === 3) {
    strengthLevel = 'fair';
    strengthText = 'Fair';
    strengthColor = 'bg-orange-500';
  } else if (metCount === 4) {
    strengthLevel = 'good';
    strengthText = 'Good';
    strengthColor = 'bg-yellow-500';
  } else {
    strengthLevel = 'strong';
    strengthText = 'Strong';
    strengthColor = 'bg-green-500';
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Strength bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">Password Strength</span>
          <span className={`text-xs font-bold ${
            strengthLevel === 'weak' ? 'text-red-600' :
            strengthLevel === 'fair' ? 'text-orange-600' :
            strengthLevel === 'good' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {strengthText}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-600">Requirements:</p>
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
              req.met ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {req.met ? '✓' : '○'}
            </div>
            <span className={`text-xs ${req.met ? 'text-gray-700' : 'text-gray-500'}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
