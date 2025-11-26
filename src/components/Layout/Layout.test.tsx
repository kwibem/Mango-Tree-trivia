import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';

describe('Layout Component', () => {
    test('renders children', () => {
        render(
            <Layout>
                <div data-testid="child">Child Content</div>
            </Layout>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    test('applies custom className', () => {
        render(
            <Layout className="custom-class">
                <div>Content</div>
            </Layout>
        );
        // The layout container is the first div
        const layoutElement = screen.getByText('Content').closest('.layout');
        expect(layoutElement).toHaveClass('custom-class');
    });
});
