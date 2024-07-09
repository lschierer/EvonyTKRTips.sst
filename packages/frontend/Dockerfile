ARG PERL_VERSION=5.38.2
ARG DEBIAN_VERSION=12
ARG DEBIAN_CODENAME=bookworm

# builder ####################################################################
FROM perl:$PERL_VERSION AS builder

WORKDIR .

ENV LANG C.UTF-8
ARG DEBIAN_FRONTEND=noninteractive

RUN set -ex \
    && sed -i -- 's/Types: deb/Types: deb deb-src/g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get dist-upgrade -y \
    && apt-get install -y \
               build-essential apt mlocate\
    && apt-get build-dep -y ikiwiki

COPY . .

RUN cpanm --installdeps --verbose -n .

RUN git clone https://github.com/lschierer/ikiwiki.git ikiwiki


WORKDIR ./ikiwiki

# base ikiwiki bundle
RUN cpanm install Data::Dumper
RUN cpanm install Test::Memory::Cycle Test::NoWarnings
RUN cpanm install HTML::Scrubber HTML::Template HTML::Parser
RUN cpanm install URI
RUN cpanm install XML::Simple
RUN cpanm install Date::Manip Date::Parse
RUN cpanm install -n Mail::Sendmail # Sendmail tests against a spammer that dislikes home connections
RUN cpanm install CGI CGI::FormBuilder CGI::Session
RUN cpanm install JSON YAML YAML::XS
RUN cpanm install Text::Markdown::Discount
RUN cpanm install RPC::XML

# ikiwiki extras - skipping a few I care less about
RUN cpanm install Authen::Passphrase Net::OpenID::Consumer
RUN cpanm install File::MimeInfo
RUN cpanm install Locale::gettext
RUN cpanm install LWPx::ParanoidAgent
RUN cpanm install LWP::Protocol::https
RUN cpanm install IO::Socket::SSL
RUN cpanm install Text::CSV Text::Typography Text::Textile Text::WikiFormat Text::WikiCreole
RUN cpanm install XML::Feed XML::Writer
RUN cpanm install Net::Amazon::S3
RUN cpanm install Term::ReadLine::Gnu
RUN cpanm install HTML::Tree
RUN cpanm install Sort::Naturally
RUN cpanm install Net::INET6Glue

RUN perl Makefile.PL \
    && make

RUN make pure_install

# Runner ####################################################################
FROM perl:$PERL_VERSION
ENV LANG C.UTF-8

WORKDIR /opt/evony_t_k_r_tips

RUN apt update \
    && apt dist-upgrade -y --no-install-recommends

COPY . .

COPY --from=builder /usr/local /usr/local

EXPOSE 3000
CMD ./script/evony_tkrtips prefork
