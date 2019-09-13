import {DefaultTooltip} from "cbioportal-frontend-commons";
import * as React from "react";

import {Mutation} from "../../model/Mutation";
import styles from "./mutationStatus.module.scss";

type MutationStatusProps = {
    value?: string;
    mutation?: Mutation;
    displayValueMap?: {[mutationStatus: string]: string};
    enableTooltip?: boolean;
};

export default class MutationStatus extends React.Component<MutationStatusProps, {}>
{
    public static defaultProps: Partial<MutationStatusProps> = {
        enableTooltip: true
    };

    public render() {
        const value = this.props.value || (this.props.mutation ? this.props.mutation.mutationStatus : undefined);
        let content: JSX.Element;

        if (value)
        {
            if (value.toLowerCase().includes("somatic"))
            {
                content = (
                    <span className={styles.somatic}>
                        {
                            (this.props.displayValueMap && (
                                this.props.displayValueMap[value.toLowerCase()] || this.props.displayValueMap["somatic"]
                            )) ||
                            "Somatic"
                        }
                    </span>
                );
            }
            else if (value.toLowerCase().includes("germline"))
            {
                content = (
                    <span className={styles.germline}>
                        {
                            (this.props.displayValueMap && (
                                this.props.displayValueMap[value.toLowerCase()] || this.props.displayValueMap["germline"]
                            )) ||
                            "Germline"
                        }
                    </span>
                );
            }
            else {
                content = <span className={styles.unknown}>{value}</span>;
            }
        }
        else {
            content = <span />;
        }

        if (this.props.enableTooltip)
        {
            content = (
                <DefaultTooltip
                    overlay={<span>{value}</span>}
                    placement="right"
                >
                    {content}
                </DefaultTooltip>
            );
        }

        return content;
    }
}
