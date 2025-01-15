/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { screen, render, cleanup } from '@testing-library/react';
import { RiskSeverity } from '../../../common/search_strategy';
import { RISK_SEVERITY_COLOUR } from '../../entity_analytics/common/utils';

import { RiskBadge } from './risk_badge';

describe('AssetInventory', () => {
  describe('RiskBadge', () => {
    beforeEach(() => {
      cleanup();
    });

    it('renders unknown risk with 0 risk score', () => {
      render(<RiskBadge risk={0} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Unknown],
      });
      expect(badge).toHaveTextContent('0');
    });
    it('renders unknown risk with 19 risk score', () => {
      render(<RiskBadge risk={19} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Unknown],
      });
      expect(badge).toHaveTextContent('19');
    });
    it('renders low risk with 20 risk score', () => {
      render(<RiskBadge risk={20} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Low],
      });
      expect(badge).toHaveTextContent('20');
    });
    it('renders low risk with 39 risk score', () => {
      render(<RiskBadge risk={39} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Low],
      });
      expect(badge).toHaveTextContent('39');
    });
    it('renders moderate risk with 40 risk score', () => {
      render(<RiskBadge risk={40} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Moderate],
      });
      expect(badge).toHaveTextContent('40');
    });
    it('renders moderate risk with 69 risk score', () => {
      render(<RiskBadge risk={69} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Moderate],
      });
      expect(badge).toHaveTextContent('69');
    });
    it('renders high risk with 70 risk score', () => {
      render(<RiskBadge risk={70} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.High],
      });
      expect(badge).toHaveTextContent('70');
    });
    it('renders high risk with 89 risk score', () => {
      render(<RiskBadge risk={89} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.High],
      });
      expect(badge).toHaveTextContent('89');
    });
    it('renders critical risk with 90 risk score', () => {
      render(<RiskBadge risk={90} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Critical],
      });
      expect(badge).toHaveTextContent('90');
    });
    it('renders critical risk with 100 risk score', () => {
      render(<RiskBadge risk={100} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Critical],
      });
      expect(badge).toHaveTextContent('100');
    });
    it('renders critical risk with risk score over limit (100)', () => {
      render(<RiskBadge risk={400} data-test-subj="badge" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveStyle({
        '--euiBadgeBackgroundColor': RISK_SEVERITY_COLOUR[RiskSeverity.Critical],
      });
      expect(badge).toHaveTextContent('400');
    });
  });
});
